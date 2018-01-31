import { Injectable } from '@angular/core';
import { Person } from './person';
import { StorageServiceProvider } from "./storage-service/storage-service";

@Injectable()
export class SetupService {
  constructor(private storage: StorageServiceProvider) { }

  fetchPerson(): Promise<Person> {
    return this.storage.getPerson();
  }

  setPerson(person: Person): Promise<any> {
    return this.storage.setPerson(person);
  }
}

