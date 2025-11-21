import express from 'express';

const router = express();

router.get('/send', (req, res) => {
    res.send('Message Send endpoint');
});

export default router;