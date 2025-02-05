import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { model, Schema, Model, connect, ConnectOptions, Document } from 'mongoose';

interface IMovie extends Document {
    title: string;
    year?: number;
    cast?: string[];
    genres?: string[];
    href?: string;
    extract?: string;
    thumbnail?: string;
    thumbnail_width?: number;
    thumbnail_height?: number;
}

const movieSchema: Schema = new Schema({
    title: { type: String, required: true },
    year: Number,
    cast: [String],
    genres: [String],
    href: String,
    extract: String,
    thumbnail: String,
    thumbnail_width: Number,
    thumbnail_height: Number,
});

let Movie: Model<IMovie>;

export async function movies(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);

    let page = parseInt(request.query["page"] as string || '1', 10);
    let limit = parseInt(request.query["limit"] as string || '10', 10);

    if (isNaN(page) || isNaN(limit) || page < 1 || limit < 1) {
        return {
            status: 400,
            body: JSON.stringify({ message: 'Invalid pagination parameters' })
        };
    }

    await connectToDatabase();

    const movies = await Movie.find()
        .limit(limit)
        .skip((page - 1) * limit)
        .sort({ year: -1 })

    const totalMovies = await Movie.countDocuments();
    const totalPages = Math.ceil(totalMovies / limit);

    return {
        body: JSON.stringify({ page: page, limit: limit, totalPages, totalMovies, movies }, null, 2)
    };
};

export async function movieById(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);

    const id = request.params.id;

    if (!id) {
        return {
            status: 400,
            body: JSON.stringify({ message: 'Movie ID is required.' })
        };
    }

    await connectToDatabase();

    const movie = await Movie.findById(id);

    if (!movie) {
        return {
            status: 404,
            body: JSON.stringify({ message: 'Movie not found.' })
        };
    }

    return {
        body: JSON.stringify(movie, null, 2)
    };
};

export async function searchMovies(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);
    
    context.log('Query:', request.query);

    let name = request.query.get("name") || '';
    let page = parseInt(request.query["page"] as string || '1', 10);
    let limit = parseInt(request.query["limit"] as string || '10', 10);

    console.log(`Searching for movies with name: ${name}, page: ${page}, limit: ${limit}`);

    if (!name) {
        return {
            status: 400,
            body: JSON.stringify({ message: 'Query parameter "name" is required.' })
        };
    }

    if (isNaN(page) || isNaN(limit) || page < 1 || limit < 1) {
        return {
            status: 400,
            body: JSON.stringify({ message: 'Invalid pagination parameters' })
        };
    }

    await connectToDatabase();

    const query = name ? { title: { $regex: name, $options: 'i' } } : {};

    const movies = await Movie.find(query)
        .limit(limit)
        .skip((page - 1) * limit)
        .sort({ year: -1 });

    const totalMovies = await Movie.countDocuments(query);
    const totalPages = Math.ceil(totalMovies / limit);

    return {
        body: JSON.stringify({ page: page, limit: limit, totalPages, totalMovies, movies }, null, 2)
    };
};


export async function connectToDatabase() {
    try {
        if (!process.env.DB_CONN_STRING || !process.env.DB_NAME || !process.env.COLLECTION_NAME) {
            throw new Error("Missing required environment variables.");
        }

        await connect(process.env.DB_CONN_STRING, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        } as ConnectOptions)
        console.log(`Successfully connected to database: ${process.env.DB_NAME} and collection: ${process.env.COLLECTION_NAME}`);

        const collectionName = process.env.COLLECTION_NAME || 'movies';
        Movie = model<IMovie>(collectionName, movieSchema);

    } catch (err) {
        console.error('MongoDB connection error:', err);
        throw new Error('MongoDB connection error');
    }
}

app.http('movies', {
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: movies,
    route: 'v1/movies'
});

app.http('movieById', {
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: movieById,
    route: 'v1/movies/{id}'
});

app.http('search', {
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: searchMovies,
    route: 'v1/library/search'
});