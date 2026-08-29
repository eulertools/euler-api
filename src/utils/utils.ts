export const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "*",
};

export const Action = { Read: "read", Create: "create", Update: "update", Delete: "delete" };

export function genericError(statusCode:number, e:any){
    return {
        statusCode,
        body: JSON.stringify( { error: e.message || e, exception: e } ),
        headers: corsHeaders
    };
}
