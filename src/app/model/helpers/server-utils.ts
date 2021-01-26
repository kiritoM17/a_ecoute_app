
export function middlewareToPromise(middlewareFunc: (req: any, res:any, next:any) => void, req:any, res?:any): Promise<any> {
    return new Promise((resolve, reject) => {
        middlewareFunc(req, res, (err:any) => {
            if (err) reject(err);
            resolve();
        });
    }).catch(error => {
        return error;
    });
}