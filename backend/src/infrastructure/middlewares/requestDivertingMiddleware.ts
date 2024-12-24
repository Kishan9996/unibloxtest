import { Request, Response, NextFunction } from 'express';

// Middleware to handle routing based on the 'route' query parameter
const routeDiverterMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const multiSearchEndPoint = req.url.split('?')?.[0] ?? '';
  if (multiSearchEndPoint.includes('/multi_search')) {
    const routeParam = req.query.route as string;
    const method: any = req.query.method ?? 'get';

    // Check if the route query parameter exists
    if (!routeParam) {
      return res.status(400).json({ error: 'Incorrect URL: "route" query parameter is required' });
    }

    // Validate the format of the route parameter (alphanumeric and dots)
    if (!/^[a-zA-Z0-9.]+$/.test(routeParam)) {
      return res.status(400).json({ error: 'Incorrect URL: "route" query parameter is invalid' });
    }

    // Transform the route from dot notation to path
    const internalRoute = routeParam.replace(/\./g, '/');

    // Rewriting the URL internally
    req.url = `/${internalRoute}`;
    req.method = method;
    // Log the internal redirection for debugging
    console.log(`Redirecting: ${req.url}--METHOD:${method}`);

    // Remove `route` from query parameters to prevent it from being passed along
    delete req.query.route;

    // Proceed to the next middleware or route handler
    next();
  } else {
    next();
  }
};

export default routeDiverterMiddleware;
