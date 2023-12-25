const db = require('../config/db');

exports.setUserAlert = (req, res) => {
  const userId = req.params.user_id;
  const environmentId = req.query.environment_id;
  const threshold = req.query.threshold;

  if (!userId || !environmentId || !threshold) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  const checkUserQuery = 'SELECT * FROM user WHERE UserID = ?';
  db.query(checkUserQuery, [userId], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const setUserAlertQuery = 'INSERT INTO user_alerts (user_id, environmental_id, threshold) VALUES (?, ?, ?)';
    db.query(setUserAlertQuery, [userId, environmentId, threshold], (err, insertResult) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal server error' });
      }
      
      return res.status(201).json({ message: 'Alert set successfully' });
    });
  });
};



exports.updateUserAlert = (req, res) => {
  const userId = req.params.user_id;
  const environmentId = req.params.environment_id;
  const newThreshold = req.body.new_threshold;

  if (!userId || !environmentId || !newThreshold) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  const checkUserAlertQuery = 'SELECT * FROM user_alerts WHERE user_id = ? AND environmental_id = ?';
  db.query(checkUserAlertQuery, [userId, environmentId], (err, alertResults) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    if (alertResults.length === 0) {
      return res.status(404).json({ message: 'User alert not found' });
    }

    const updateAlertQuery = 'UPDATE user_alerts SET threshold = ? WHERE user_id = ? AND environmental_id = ?';
    db.query(updateAlertQuery, [newThreshold, userId, environmentId], (err, updateResult) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal server error' });
      }
      
      return res.status(200).json({ message: 'Threshold updated successfully' });
    });
  });
};
