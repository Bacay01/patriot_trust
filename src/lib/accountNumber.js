// src/lib/accountNumber.js

// Generates a random 10-digit account number as a string.
export function generateAccountNumber() {
  let number = "";
  for (let i = 0; i < 10; i++) {
    number += Math.floor(Math.random() * 10); // 0–9
  }
  return number;
}