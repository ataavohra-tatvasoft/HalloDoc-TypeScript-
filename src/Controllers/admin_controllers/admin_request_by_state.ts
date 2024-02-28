import { NextFunction, Request, Response } from 'express';
import RequestModel from '../../db/models/request';

export const requests_by_state = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { state } = req.params;     
        const requests = await RequestModel.findAll({ where: { request_state:state } });
        res.json(requests);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

