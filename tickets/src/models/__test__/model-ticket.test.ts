import {Ticket} from '../model-ticket';

it('implements optimistic concurrency control', async (done)=> {
    //create an instace of a ticket
    const ticket = Ticket.build({
        title:'concert',
        price: 5,
        userId: '123'
    });

    //save the ticket
    await ticket.save();
    
    //fetch the ticket twice
    const firstInstance = await Ticket.findById(ticket.id);
    const secondInstance = await Ticket.findById(ticket.id);

    //make two seaparated changes to the tickets
    firstInstance!.set({price: 10});
    secondInstance!.set({price: 15});

    //save the first ticket and check the version
    await firstInstance!.save();

    //save the second ticket and check version
    try {
        await secondInstance!.save();
    } catch (err)
     {
         return done();
     }

     throw new Error('Should not reach this point');
    
});

it('increments the version number on multiple updates', async () => {
    const ticket= Ticket.build({
        title: 'concert',
        price: 5,
        userId: '1213'
    });

    await ticket.save();
    expect(ticket.version).toEqual(0);

    await ticket.save();
    expect(ticket.version).toEqual(1);
    
    await ticket.save();
    expect(ticket.version).toEqual(2);
    
});