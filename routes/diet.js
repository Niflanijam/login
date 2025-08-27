const express = require("express");
const router = express.Router();
const axios = require("axios");

require("dotenv").config();

const EDAMAM_APP_ID = process.env.EDAMAM_APP_ID;
const EDAMAM_APP_KEY = process.env.EDAMAM_APP_KEY;

// Function to calculate daily calorie needs
function calculateCalories({ weight, height, age, gender, activityLevel }) {
  let bmr;
  if (gender === "male") {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161;
  }

  const activityMultipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
  };

  return Math.round(bmr * activityMultipliers[activityLevel]);
}

// POST /diet-plan
router.post("/", async (req, res) => {
  try {
    const { weight, height, age, gender, activityLevel } = req.body;

    // 1️⃣ Calculate calories
    const calories = calculateCalories({ weight, height, age, gender, activityLevel });

    // 2️⃣ Fetch recipes from Edamam
    const response = await axios.get("https://api.edamam.com/api/recipes/v2", {
      params: {
        type: "public",
        q: "meal", // can be customized
        app_id: EDAMAM_APP_ID,
        app_key: EDAMAM_APP_KEY,
        calories: `${calories}-${calories + 200}`,
        diet: "balanced"
      }
    });

    // 3️⃣ Return results
    res.json({
      calories,
      mealPlan: response.data.hits || []
    });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: "Failed to generate diet plan" });
  }
});

module.exports = router;
