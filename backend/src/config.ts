process.loadEnvFile();

type APIconfig = {
    fileserverHits: number;
    secret: string;
}

export let config: APIconfig = {
        fileserverHits : 0,
        secret: envOrThrow(process.env.SECRET_KEY),
};

function envOrThrow(key: any): string{
    if(!key){
        throw new Error("Error getting key in config.ts");
    }
    return key;
}