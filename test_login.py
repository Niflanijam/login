from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

# ------------------------------
# Step 1: Open Chrome
# ------------------------------
driver = webdriver.Chrome()  # Add executable_path if needed
driver.maximize_window()
wait = WebDriverWait(driver, 10)

# ------------------------------
# Step 2: Go to Register page
# ------------------------------
driver.get("http://localhost:3000/")  # Replace with your Register URL

# ------------------------------
# Step 3: Fill Register form
# ------------------------------
username_input = wait.until(EC.presence_of_element_located((By.ID, "username")))
email_input = driver.find_element(By.ID, "email")
password_input = driver.find_element(By.ID, "password")

username_input.send_keys("newuser")
email_input.send_keys("newuser@example.com")
password_input.send_keys("Password@123")  # Must match your regex rules

# ------------------------------
# Step 4: Wait until register button is clickable
# ------------------------------
register_button = wait.until(EC.element_to_be_clickable((By.ID, "registerBtn")))
driver.execute_script("arguments[0].scrollIntoView();", register_button)
register_button.click()

# ------------------------------
# Step 5: Wait for registration alert
# ------------------------------
time.sleep(2)  # Simple wait for alert
alert = driver.switch_to.alert
print(alert.text)  # Should print "Registered successfully!"
alert.accept()

# ------------------------------
# Step 6: Go to Login page
# ------------------------------
driver.get("http://localhost:3000/login")  # Replace with Login URL

# ------------------------------
# Step 7: Fill Login form
# ------------------------------
email_input = wait.until(EC.presence_of_element_located((By.ID, "email")))
password_input = driver.find_element(By.ID, "password")

email_input.send_keys("newuser@example.com")
password_input.send_keys("Password@123")

login_button = driver.find_element(By.ID, "loginBtn")
login_button.click()

# ------------------------------
# Step 8: Wait for login success element
# ------------------------------
try:
    success_element = wait.until(EC.presence_of_element_located(
        (By.XPATH, '//h4[contains(text(),"Welcome Back")]')  # Adjust as per your Home page
    ))
    print("Login successful for new user!")
except:
    print("Login failed or element not found.")

# ------------------------------
# Step 9: Close browser
# ------------------------------
driver.quit()
