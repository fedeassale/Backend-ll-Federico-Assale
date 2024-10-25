import TicketRepository from "../repositories/ticket.repository.js"; 
import { v4 as uuidv4 } from 'uuid';

const ticketRepository = new TicketRepository(); 

class TicketService {
    async createTicket(cart, user) {
        const totalAmount = cart.products.reduce((total, item) => 
            total + item.product.price * item.quantity, 0);

        const ticketData = {
            code: uuidv4(),
            purchase_datetime: new Date(),
            amount: totalAmount,
            purchaser: user._id
        };

        return await ticketRepository.createTicket(ticketData); 
    }
}

export default new TicketService(); 