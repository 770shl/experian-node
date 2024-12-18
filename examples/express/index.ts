import express, { Request, Response } from 'express';
import { Experian } from '../../lib/experian';

const app = express();

//Sandbox
const clientId: string = process.env['EXPERIAN_CLIENT_ID']!;
const clientSecret: string = process.env['EXPERIAN_CLIENT_SECRET']!;
const username: string = process.env['EXPERIAN_USERNAME']!;
const password: string = process.env['EXPERIAN_PASSWORD']!;
const subcode: string = process.env['EXPERIAN_SUBCODE']!;

const experianInstance = new Experian(clientId, clientSecret);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

app.get('/search', (req: Request, res: Response) => {
    let myRequest = req.body;

    experianInstance.business.us.search(myRequest)
    .then((data: any) => {
        console.log('Got Data!');
        console.log(data);
        res.setHeader('Content-Type', 'application/json');
        res.send(data);
    }, (error: any) => {
        console.error(error);
        res.setHeader('Content-Type', 'application/json');
        res.send(error);
    });
});

app.get('/headers/:bin', (req: Request, res: Response) => {
    experianInstance.business.us.headers({
        subcode: subcode,
        bin: req.params.bin
    })
    .then((data: any) => {
        console.log('Got Data!');
        console.log(data);
        res.setHeader('Content-Type', 'application/json');
        res.send(data);
    }, (error: any) => {
        console.error(error);
        res.setHeader('Content-Type', 'application/json');
        res.send(error);
    });
});

app.listen(3000, () => {
  console.log('Example app listening on port 3000!');
  experianInstance.login(username, password)
  .then((result: any) => {
      console.log('Logged In To Experian API');
  });
});
