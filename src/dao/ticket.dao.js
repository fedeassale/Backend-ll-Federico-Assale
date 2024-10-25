import TicketModel from "./models/ticket.model.js";

class TicketDao {
    async create(ticketData) {
        const ticket = new TicketModel(ticketData);
        return await ticket.save();
    }
}

export default new TicketDao();