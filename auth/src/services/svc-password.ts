import {scrypt, randomBytes} from 'crypto';
import { promisify } from 'util';

const scrytAsync = promisify(scrypt);

export class PasswordManager {
    static async toHash(password: string) {
        const salt = randomBytes(8).toString('hex');
        //console.log('pass: '+password );
        //console.log('salt: '+salt );
        const buf = (await scrytAsync(password, salt, 64)) as Buffer;
        //console.log('hashedpass: '+`${buf.toString('hex')}.${salt}` );
        return `${buf.toString('hex')}.${salt}`;
    }

    static async compare(storedPassword: string, suppliedPassword: string) {
        const [ hashedPassword , salt ] = storedPassword.split(".");
        //console.log('storedpass: '+storedPassword );
        //console.log('hashedPassword: '+hashedPassword );
        //console.log('salt: '+salt );
        const buf = (await scrytAsync(suppliedPassword, salt, 64)) as Buffer;
        //console.log('pass: '+suppliedPassword );
        //console.log('suppliedPassword: '+buf.toString('hex'));
        return buf.toString('hex') === hashedPassword;
    }

}