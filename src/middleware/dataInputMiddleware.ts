import { isDataInputUser, isPageAllowed } from '../utils/dataInputAccess';

export default async function dataInputMiddleware(req, res, next) {
  try {
    const isDataInput = await isDataInputUser();
    
    if (!isDataInput) {
      return next(); // Continue for non-data input users
    }

    const currentPage = req.url.split('/')[1];
    const isAllowed = await isPageAllowed(currentPage);

    if (!isAllowed) {
      return res.redirect('/'); // Redirect to home if not allowed
    }

    next();
  } catch (error) {
    console.error('Error in data input middleware:', error);
    next();
  }
}
