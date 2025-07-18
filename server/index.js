import express from 'express';
import cors from 'cors';
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from './routes/authRoutes.js';
import eventsRoutes from './routes/eventsRoutes.js';
import videoRoutes from './routes/videoRoutes.js';
import newsRoutes from './routes/newsRoutes.js'
import galleryRoutes from './routes/galleryRoutes.js'
import parishesRoutes from './routes/parishesRoutes.js'
import directoryRoutes from './routes/directoryRoutes.js'
import contactRoutes from './routes/contactRoutes.js'
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'Uploads')));
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

app.use('/api/auth', authRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/videos', videoRoutes);
app.use("/api/news", newsRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/parishes', parishesRoutes);
app.use('/api/directory', directoryRoutes);
app.use('/api/contact', contactRoutes);


