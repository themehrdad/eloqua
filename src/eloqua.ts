import * as request from 'request';
import {Id} from './response/id';

export class Eloqua {
    public static readonly loginUrl: string = "https://login.eloqua.com/id";
    public id: null | Id = null;

    constructor(public site: string,
        public user: string,
        public password: string) {

    }

    public async login(): Promise<string> {
        return new Promise<string>((resolve, reject)=> {
            console.log(this);
            return request.get(Eloqua.loginUrl, {
                auth: {
                    username: `${this.site}\\${this.user}`,
                    password: this.password
                }
            }, (error: any, response: any, body: string) => {
                if(error){
                    return reject(error);
                }
                this.id = JSON.parse(body);
                return resolve(body);
            })    
        });
    }
}