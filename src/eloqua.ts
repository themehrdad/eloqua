import * as request from 'request';

export class Eloqua {
    public static readonly loginUrl: string = "https://login.eloqua.com/id";

    constructor(public site: string,
        public user: string,
        public password: string) {

    }

    public async login(): Promise<string> {
        return new Promise<string>((resolve, reject)=> {
            return request.get(Eloqua.loginUrl, {
                auth: {
                    username: `${this.site}\\${this.user}`,
                    password: this.password
                }
            }, (error: any, response: any, body: string) => {
                if(error){
                    return reject(error);
                }
                console.log(typeof response);
                return resolve(body);
            })    
        });
    }
}