import { Router, Request, Response } from 'express';
import {getCloudSave, updateCloudSave} from '../services/accelbyte.js';
import config from '../config.js';
const router = Router();

router.get('/', async (req: Request, res: Response) => {
    if (req.headers.authorization?.trim() !== `Bearer ${config.SERENDIP_WHITELIST_TOKEN}`.trim()) {
        console.log("Unauthorized, the token was: ", req.headers.authorization, "expected: ", `Bearer ${config.SERENDIP_WHITELIST_TOKEN}`);
        res.status(401).json({message: 'Unauthorized'});
        return;
    }
    let result = await getCloudSave('permissions');
    res.json(result);
});

router.post ('/', async (req: Request, res: Response) => {
    if (req.headers.authorization !== `Bearer ${config.SERENDIP_WHITELIST_TOKEN}`) {
        res.status(401).json({message: 'Unauthorized'});
        return;
    }
    console.log("req.body", req.body)
    if (!req.body) {
        res.status(400).json({message: 'Missing permissions data'});
        return;
    }
    let old = await getCloudSave('permissions');
    if (old.value) {
        let newPermissions = req.body;
        old.value.value.episode_1 = [...(new Set([...old.value.value.episode_1, ...newPermissions]))];
        let result = await updateCloudSave('permissions', old.value);
        res.json(result);
    } else {
        res.status(500).json({message: 'Failed to get permissions'});
    }
});

export default router;
