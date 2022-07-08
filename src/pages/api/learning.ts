import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';

export default function Handler(
  req: NextApiRequest,
  res: NextApiResponse<any>,
) {
  const query = req.query;
  const { code, phpsessid } = query;

  axios({
    method: `post`,
    url: `https://learningapps.org/collection.php`,
    data: { c: code },
    headers: {
      'Content-Type': `multipart/form-data`,
      Cookie: `PHPSESSID=${phpsessid}`,
    },
  })
    .then(function (response) {
      res.status(200).json(response.data);
    })
    .catch(function (error) {
      res.status(500).json({ error: error.message });
    });
}
