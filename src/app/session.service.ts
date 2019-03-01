import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Project } from './project';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class SessionService {

    private base = "http://127.0.0.1:8080/";
    public settingsDefinition: object;

    public project: Project;
    public session: object;

    public registries = [
        'https://synbiohub.org/',
        'https://synbiohub.utah.edu/',
        'https://synbiohub.cidarlab.org/',
        'https://synbiohub.programmingbiology.org/'
    ];
    public collections = [];
    public registry: string;
    public collection: string;

    public inputConstraints = <{}[]>[];
    public outputConstraints = <{}[]>[];

    constructor(
        private http: HttpClient,
        private storage: Storage,
    ) {
        this.registry = 'https://synbiohub.programmingbiology.org/';
        this.collection = 'https://synbiohub.programmingbiology.org/public/Eco1C1G1T1/Eco1C1G1T1_collection/1';
        this.getCollections(this.registry).subscribe((result) => {
            this.collections = result;
        });
        this.getLoginInfo().then((data) => {
            this.session = data;
        });
        this.getSettingsDefinition().then((data) => {
            this.settingsDefinition = data;
        });
        this.project = new Project();
    }

    getLoginInfo(): Promise<object> {
        return this.storage.get('session');
    }

    setLoginInfo(session: object) {
        this.session = session;
        console.log(session);
        this.storage.set('session', session);
    }

    getSettingsDefinition() {
        return new Promise((resolve, reject) => {
            this.http.get('assets/json/settings.json')
                .subscribe((result) => {
                    resolve(result);
                }, (error) => {
                    reject(error);
                });
        });
    }

    getCollections(registry: string): Observable<object[]> {
        let url = registry + 'rootCollections';
        return this.http.get<object[]>(url);
    }

    settings(): object {
        let parameters = {};
        for (let stage in this.project.settings.algorithms) {
            parameters[stage] = this.project.settings.algorithms[stage];
        }
        for (let parameter in this.project.settings.parameters) {
            parameters[parameter] = this.project.settings.parameters[parameter];
        }
        let body = { 'application': this.project.application, 'parameters': parameters }
        return body;
    }

    library() {
        let useRegistry = true;
        let body = {
            use_registry: useRegistry,
        };
        if (useRegistry) {
            body['registry'] = this.registry;
            body['collection'] = this.collection;
        }
        return body;
    }

    verilog() {
        return this.project.verilog;
    }

    specification(): object {
        let specification = {
            settings: this.settings(),
            library: this.library(),
            verilog: this.verilog(),
            // constraints: this.constraints(),
        }
        return specification;
    }

    submit() {
        return Promise.resolve()
            .then(() => {
                let body = {
                    name: this.project.name,
                    specification: this.specification()
                };
                body = Object.assign(this.session, body);
                return this.specify(body).toPromise();
            })
            .then(() => {
                let body = {
                    name: this.project.name,
                };
                body = Object.assign(this.session, body);
                return this.execute(body);
            });
    }

    /////////
    // API //
    /////////

    login(body: object): Observable<object> {
        return this.http.post<object>(this.base + 'login', JSON.stringify(body));
    }

    signup(body: any): Observable<object> {
        return this.http.post<object>(this.base + 'signup', JSON.stringify(body));
    }

    projects(body: any): Observable<object[]> {
        return this.http.post<object[]>(this.base + 'projects', JSON.stringify(body));
    }

    specify(body: any): Observable<object> {
        return this.http.post<object>(this.base + 'specify', JSON.stringify(body));
    }

    execute(body: any) {
        return this.http.post<object>(this.base + 'execute', JSON.stringify(body));
    }

}
