export type QueryConfig = {
    // the raw query text
    text: string;

    // an array of query parameters
    values?: Array<any>;

    // name of the query - used for prepared statements
    name?: string;

    // by default rows come out as a key/value pair for each row
    // pass the string 'array' here to receive rows as an array of values
    rowMode?: string;

    // custom type parsers just for this query result
    // types?: Types;
};