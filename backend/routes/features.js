const express = require('express');
const { PrismaClient } = require('@prisma/client');
const rateLimit = require('express-rate-limit');

const router = express.Router();
const prisma = new PrismaClient();

// Rate limiting for voting
const voteLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 votes per IP per 15 minutes
  message: { error: 'Too many votes. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Helper function to get client IP
const getClientIP = (req) => {
  return req.headers['x-forwarded-for'] || 
         req.headers['x-real-ip'] ||
         req.connection.remoteAddress || 
         req.socket.remoteAddress ||
         (req.connection.socket ? req.connection.socket.remoteAddress : null) ||
         '127.0.0.1';
};

// GET /api/features - List all features
router.get('/', async (req, res) => {
  try {
    const features = await prisma.feature.findMany({
      orderBy: [
        { votes: 'desc' },
        { createdAt: 'desc' }
      ],
      include: {
        _count: {
          select: { Vote: true }
        }
      }
    });

    res.json({
      success: true,
      data: features.map(feature => ({
        ...feature,
        voteCount: feature._count.Vote
      }))
    });
  } catch (error) {
    console.error('Error fetching features:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch features' 
    });
  }
});

// POST /api/features - Create new feature
router.post('/', async (req, res) => {
  try {
    const { title, description, authorName } = req.body;

    // Validation
    if (!title || !authorName) {
      return res.status(400).json({
        success: false,
        error: 'Title and author name are required'
      });
    }

    if (title.length > 255 || authorName.length > 100) {
      return res.status(400).json({
        success: false,
        error: 'Title or author name too long'
      });
    }

    const feature = await prisma.feature.create({
      data: {
        title: title.trim(),
        description: description?.trim() || null,
        authorName: authorName.trim()
      }
    });

    res.status(201).json({
      success: true,
      data: feature
    });
  } catch (error) {
    console.error('Error creating feature:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to create feature' 
    });
  }
});

// POST /api/features/:id/vote - Vote for a feature
router.post('/:id/vote', voteLimit, async (req, res) => {
  try {
    const featureId = parseInt(req.params.id);
    const voterIp = getClientIP(req);

    if (isNaN(featureId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid feature ID'
      });
    }

    // Check if feature exists
    const feature = await prisma.feature.findUnique({
      where: { id: featureId }
    });

    if (!feature) {
      return res.status(404).json({
        success: false,
        error: 'Feature not found'
      });
    }

    // Use transaction to handle vote creation and count update
    const result = await prisma.$transaction(async (tx) => {
      // Try to create vote (will fail if duplicate due to unique constraint)
      try {
        await tx.vote.create({
          data: {
            featureId,
            voterIp
          }
        });
      } catch (error) {
        if (error.code === 'P2002') { // Unique constraint violation
          throw new Error('ALREADY_VOTED');
        }
        throw error;
      }

      // Update vote count
      const updatedFeature = await tx.feature.update({
        where: { id: featureId },
        data: { votes: { increment: 1 } }
      });

      return updatedFeature;
    });

    res.json({
      success: true,
      data: result,
      message: 'Vote recorded successfully'
    });

  } catch (error) {
    console.error('Error voting:', error);
    
    if (error.message === 'ALREADY_VOTED') {
      return res.status(409).json({
        success: false,
        error: 'You have already voted for this feature'
      });
    }

    res.status(500).json({ 
      success: false, 
      error: 'Failed to record vote' 
    });
  }
});

// GET /api/features/:id - Get single feature
router.get('/:id', async (req, res) => {
  try {
    const featureId = parseInt(req.params.id);

    if (isNaN(featureId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid feature ID'
      });
    }

    const feature = await prisma.feature.findUnique({
      where: { id: featureId },
      include: {
        _count: {
          select: { Vote: true }
        }
      }
    });

    if (!feature) {
      return res.status(404).json({
        success: false,
        error: 'Feature not found'
      });
    }

    res.json({
      success: true,
      data: {
        ...feature,
        voteCount: feature._count.Vote
      }
    });
  } catch (error) {
    console.error('Error fetching feature:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch feature' 
    });
  }
});

module.exports = router;