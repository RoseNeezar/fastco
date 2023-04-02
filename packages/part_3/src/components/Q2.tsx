import React, { useState } from "react";

const Q2: React.FC = () => {
  const generateRandomNumbers = (len: number): number[] => {
    const randomNumbers: number[] = [];
    for (let i = 0; i < len; i++) {
      const randomNumber = Math.floor(Math.random() * 100) + 1;
      randomNumbers.push(randomNumber);
    }
    return randomNumbers;
  };

  const [numbers, setNumbers] = useState<number>(0);

  return (
    <div>
      <h3>Random Numbers List:</h3>
      <div className="w-full my-5 flex flex-1 flex-col">
        <input
          type="number"
          className="input input-bordered mb-5"
          value={numbers}
          onChange={(e) => setNumbers(parseInt(e.target.value, 10))}
        />

        <ul>
          {generateRandomNumbers(numbers).map((number, index) => (
            <li key={index}>{number}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Q2;
