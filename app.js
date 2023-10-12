const express = require("express");
const bodyParser = require("body-parser");

const adjectiveSurName = require("./adjectiveSurName");
const app = express();

app.use(bodyParser.json());

function declineNameCase(name, gender = "male", caseType = "genitive") {
  let declinedName = name;
  if (caseType === "genitive") {
    if (gender === "male") {
      declinedName = declinedName
        .replace(/а$/, "и") // закінчення на "а";
        .replace(/я$/, "і") // закінчення на "я";
        .replace(/(Ігор)$/, declinedName + "я") // вийняток "Ігор"
        .replace(/(Лазар)$/, declinedName + "я") // вийняток "Лазар"
        .replace(/([бвгґджзклмнпрстфхцчшщ])$/, lastName.slice(-1) + "а") // закінчення на приголосну
        .replace(/(Лаврін)$/, declinedName + "а") // вийняток "Лаврін"
        .replace(/(Олефір)$/, declinedName + "а") // вийняток "Олефір"
        .replace(
          /(і[бвгґджзклмнпрстфхцчшщ])$/,
          "о" + declinedName.slice(-1) + "а"
        ) // закінчення на "і"+приголосна
        .replace(
          /([бвгґджзклмнпрстфхцчшщ]о)$/,
          declinedName.slice(-2, -1) + "а"
        ); // закінчення на приголосна+"о";
    } else if (gender === "female") {
      declinedName = declinedName.replace(/а$/, "и").replace(/я$/, "і");
    }
  }

  return declinedName;
}

function declineLastName(lastName, gender = "male", caseType = "genitive") {
  let lastNameType = adjectiveSurName.includes(lastName.toLowerCase())
    ? "adjective"
    : "noun";
  if (lastNameType === "noun") {
    if (caseType === "genitive") {
      if (gender === "male") {
        lastName = lastName
          .replace(/а$/, "и") // закінчення на "а"
          .replace(/я$/, "і") // закінчення на "я"
          .replace(/(ьо|й)$/, "я") // закінчення на "ьо", "й"
          .replace(/єць$/, "йця") // закінчення на "єць"
          .replace(/ець$/, "ця") // закінчення на "ець"
          .replace(
            /(і[бвгґджзклмнпрстфхцчшщ]ь)$/,
            "е" + lastName.slice(-2, -1) + "я"
          ) // закінчення на "і"+приголосна+"ь"
          .replace(/([бвгґджзклмнпрстфхцчшщ]ь)$/, lastName.slice(-2, -1) + "я") // закінчення на приголосна+"ь"
          .replace(
            /(і[бвгґджзклмнпрстфхцчшщ])$/,
            "о" + lastName.slice(-1) + "а"
          ) // закінчення на "і"+приголосна
          .replace(/([бвгґджзклмнпрстфхцчшщ])$/, lastName.slice(-1) + "а") // закінчення на приголосну
          .replace(/о$/, "а"); // закінчення на "о"
      } else if (gender === "female") {
        lastName = lastName
          .replace(/а$/, "и") // закінчення на "а"
          .replace(/я$/, "і"); // закінчення на "я"
      }
    }
  } else if (lastNameType === "adjective") {
    if (caseType === "genitive") {
      if (gender === "male") {
        lastName = lastName
          .replace(/(ой|ий)$/, "ого") // закінчення на "ой", "ий"
          .replace(/ій$/, "ього") // закінчення на "ій"
          .replace(/ов$/, "ова") // закінчення на "ов"
          .replace(/єв$/, "єва") // закінчення на "єв"
          .replace(/ів$/, "іва") // закінчення на "ів"
          .replace(/їв$/, "їва") // закінчення на "їв"
          .replace(/ин$/, "ина") // закінчення на "ин"
          .replace(/ін$/, "іна") // закінчення на "ін"
          .replace(/їн$/, "їна"); // закінчення на "їн"
      } else if (gender === "female") {
        lastName = lastName
          .replace(/(а)$/, "ої") // закінчення на "а"
          .replace(
            /([бвгґджзклмнпрстфхцчшщ]я)$/,
            lastName.slice(-2, -1) + "ьої"
          ); // закінчення на приголосна+"я"
      }
    }
  }

  return lastName;
}

function declineMiddleName(middleName, gender = "male", caseType = "genitive") {
  let declinedMiddleName = middleName;
  if (caseType === "genitive") {
    if (gender === "male") {
      declinedMiddleName = declinedMiddleName.replace(/а$/, "овича");
    } else if (gender === "female") {
      declinedMiddleName = declinedMiddleName.replace(/а$/, "івни");
    }
  }

  return declinedMiddleName;
}

app.post("/declineName", (req, res) => {
  const { lastName, firstName, middleName, gender, lastNameType, caseType } =
    req.body;

  const declinedLastName = declineLastName(
    lastName,
    gender,
    lastNameType,
    caseType
  );
  const declinedFirstName = declineNameCase(firstName, gender, caseType);
  const declinedMiddleName = declineMiddleName(middleName, gender, caseType);

  const declinedData = {
    lastName: declinedLastName,
    firstName: declinedFirstName,
    middleName: declinedMiddleName,
  };

  res.json(declinedData);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

//запустити сервер node app.js
