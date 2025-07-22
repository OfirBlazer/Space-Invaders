const APP_ID = 'a8011d91'
const APP_KEY = '98e66275491377512ff9bdcaf3519e05'

// --- אלמנטים DOM ---
const authSection = document.getElementById('auth-section')
const authForm = document.getElementById('auth-form')
const emailInput = document.getElementById('email-input')
const passwordInput = document.getElementById('password-input')
const authMessage = document.getElementById('auth-message')

const mainContent = document.getElementById('main-content')
const logoutLink = document.getElementById('logout-link')

const foodInput = document.getElementById('food-name')
const foodGramsInput = document.getElementById('food-grams')
const foodForm = document.getElementById('food-form')
const foodList = document.getElementById('food-list')
const suggestionsContainer = document.getElementById('suggestions')

const contactForm = document.getElementById('contact-form')
const formStatus = document.getElementById('form-status')

let debounceTimeout = null

// --- פונקציות התחברות (localStorage פשוטה) ---
function checkLoggedIn() {
  const userEmail = localStorage.getItem('userEmail')
  if (userEmail) {
    authSection.style.display = 'none'
    mainContent.style.display = 'block'
    logoutLink.style.display = 'inline'
  } else {
    authSection.style.display = 'block'
    mainContent.style.display = 'none'
    logoutLink.style.display = 'none'
  }
}

authForm.addEventListener('submit', (e) => {
  e.preventDefault()
  const email = emailInput.value.trim()
  const password = passwordInput.value

  if (email && password) {
    localStorage.setItem('userEmail', email)
    authMessage.textContent = 'התחברת בהצלחה!'
    setTimeout(() => {
      authMessage.textContent = ''
      checkLoggedIn()
    }, 1000)
  } else {
    authMessage.textContent = 'אנא מלא את כל השדות'
  }
})

logoutLink.addEventListener('click', () => {
  localStorage.removeItem('userEmail')
  checkLoggedIn()
})

// --- השלמת מילים ליומן תזונה ---
function fetchFoodSuggestions(query) {
  return fetch(
    'https://trackapi.nutritionix.com/v2/search/instant?query=' + encodeURIComponent(query) + '&locale=he_IL',
    {
      headers: {
        'x-app-id': APP_ID,
        'x-app-key': APP_KEY,
      },
    }
  )
    .then((res) => res.json())
    .then((data) => data.common || [])
    .catch(() => [])
}

foodInput.addEventListener('input', () => {
  clearTimeout(debounceTimeout)
  const query = foodInput.value.trim()

  if (!query) {
    suggestionsContainer.style.display = 'none'
    suggestionsContainer.innerHTML = ''
    return
  }

  debounceTimeout = setTimeout(() => {
    fetchFoodSuggestions(query).then((suggestions) => {
      suggestionsContainer.innerHTML = ''
      if (suggestions.length === 0) {
        suggestionsContainer.style.display = 'none'
        return
      }
      suggestions.slice(0, 10).forEach((item) => {
        const div = document.createElement('div')
        div.textContent = item.food_name
        div.addEventListener('mousedown', (e) => {
          e.preventDefault() // למנוע איבוד פוקוס
          foodInput.value = item.food_name
          suggestionsContainer.style.display = 'none'
          suggestionsContainer.innerHTML = ''
          foodGramsInput.focus()
        })
        suggestionsContainer.appendChild(div)
      })
      suggestionsContainer.style.display = 'block'
    })
  }, 300)
})

foodInput.addEventListener('blur', () => {
  setTimeout(() => {
    suggestionsContainer.style.display = 'none'
    suggestionsContainer.innerHTML = ''
  }, 150)
})

// --- טיפול בהוספת מאכל ליומן תזונה ---
foodForm.addEventListener('submit', (e) => {
  e.preventDefault()

  const foodName = foodInput.value.trim()
  const grams = Number(foodGramsInput.value)

  if (!foodName) {
    alert('אנא הזן שם מאכל')
    return
  }
  if (!grams || grams <= 0) {
    alert('אנא הזן משקל תקין בגרמים')
    return
  }

  fetch('https://trackapi.nutritionix.com/v2/natural/nutrients', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-app-id': APP_ID,
      'x-app-key': APP_KEY,
    },
    body: JSON.stringify({
      query: `${grams} גרם ${foodName}`,
      locale: 'he_IL',
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (!data.foods || data.foods.length === 0) {
        alert('לא נמצאו נתונים למאכל זה.')
        return
      }
      const foodData = data.foods[0]

      if (foodList.children.length === 1 && foodList.children[0].textContent === 'לא הוזנו עדיין נתונים') {
        foodList.innerHTML = ''
      }

      const li = document.createElement('li')
      li.innerHTML = `
        <strong>${foodData.food_name}</strong> - ${grams} גרם<br>
        קלוריות: ${Math.round(foodData.nf_calories)} קק"ל | חלבון: ${foodData.nf_protein.toFixed(
        1
      )} גרם | שומנים: ${foodData.nf_total_fat.toFixed(1)} גרם | פחמימות: ${foodData.nf_total_carbohydrate.toFixed(
        1
      )} גרם
      `
      foodList.appendChild(li)

      // איפוס השדות
      foodInput.value = ''
      foodGramsInput.value = ''
      foodInput.focus()
    })
    .catch(() => {
      alert('שגיאה בשירות חישוב הקלוריות, נסה שוב מאוחר יותר.')
    })
})

// --- טיפול טופס צור קשר ---
contactForm.addEventListener('submit', (e) => {
  e.preventDefault()
  formStatus.textContent = 'נשלח! תודה שפנית אלינו.'
  contactForm.reset()
})

// --- אתחול מצב התחברות ---
checkLoggedIn()
