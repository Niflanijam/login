const express = require("express");
const router = express.Router();
const axios = require("axios");
require("dotenv").config();

const EDAMAM_APP_ID = process.env.EDAMAM_APP_ID;
const EDAMAM_APP_KEY = process.env.EDAMAM_APP_KEY;
const USER_ID = process.env.EDAMAM_USER_ID;

// Function to calculate daily calorie needs
function calculateCalories({ weight, height, age, gender, activityLevel }) {
  let bmr;
  if (gender === "male") bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  else bmr = 10 * weight + 6.25 * height - 5 * age - 161;

  const activityMultipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
  };

  return Math.round(bmr * activityMultipliers[activityLevel]);
}
/*
router.post("/", async (req, res) => {
  try {
    const { weight, height, age, gender, activityLevel } = req.body;
    const calories = calculateCalories({ weight, height, age, gender, activityLevel });

    const data = {
      targetCalories: calories,
      timeFrame: "day",
      diet: "balanced"
    };

    // Call the new Edamam Meal Planner endpoint  free api used from edamam
    const response = await axios.post(
      `https://api.edamam.com/api/recipes/v2`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
          "x-app-id": EDAMAM_APP_ID,
          "x-app-key": EDAMAM_APP_KEY,
          "Edamam-Account-User": USER_ID
        }
      }
    );

    res.json({
      calories,
      mealPlan: response.data.meals || []
    });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: "Failed to generate diet plan" });
  }
});*/
router.post("/", async (req, res) => {
  try {
    const { weight, height, age, gender, activityLevel } = req.body;
    const calories = calculateCalories({ weight, height, age, gender, activityLevel });

    const response = await axios.get("https://api.edamam.com/api/recipes/v2", {
      params: {
        type: "public",
        q: "meal", // you can adjust: chicken, rice, etc.
        app_id: EDAMAM_APP_ID,
        app_key: EDAMAM_APP_KEY,
        calories: `${calories}-${calories + 200}`,
        diet: "balanced"
      }
    });

    res.json({
      calories,
      mealPlan: response.data.hits || []
    });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: "Failed to generate diet plan" });
  }
});

module.exports = router;
