const express = require("express");
const router = express.Router();

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

// Mock meal generator
function generateMealPlan(calories) {
  return [
    { meal: "Breakfast", food: "Oatmeal with fruits", calories: Math.round(calories * 0.25) },
    { meal: "Lunch", food: "Grilled chicken with salad", calories: Math.round(calories * 0.35) },
    { meal: "Snack", food: "Greek yogurt with nuts", calories: Math.round(calories * 0.15) },
    { meal: "Dinner", food: "Steamed fish with vegetables", calories: Math.round(calories * 0.25) },
  ];
}

router.post("/", (req, res) => {
  try {
    const { weight, height, age, gender, activityLevel } = req.body;
    const calories = calculateCalories({ weight, height, age, gender, activityLevel });
    const mealPlan = generateMealPlan(calories);

    res.json({ calories, mealPlan });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to generate diet plan" });
  }
});

module.exports = router;
