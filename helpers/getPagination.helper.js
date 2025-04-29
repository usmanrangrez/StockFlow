export const getPaginationParams = (req) => {
    let { limit = 10, offset = 0 } = req.query;
    
    // Convert to integers with fallbacks
    limit = parseInt(limit, 10) || 10;
    offset = parseInt(offset, 10) || 0;
    
    // Add bounds checking
    limit = Math.min(Math.max(1, limit), 100); 
    offset = Math.max(0, offset); 
    
    return { limit, offset };
  };
  
