
import ticketDao from "../dao/ticket.dao.js";

class TicketRepository {
    async createTicket(ticketData) {
        return await ticketDao.create(ticketData);
    }
}

 export default TicketRepository;
