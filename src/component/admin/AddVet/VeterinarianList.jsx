import React, { useEffect, useState } from "react";

const VeterinarianList = () => {
  const [veterinarians, setVeterinarians] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3001/api/veterinarians/list")
      .then((res) => res.json())
      .then((data) => setVeterinarians(data))
      .catch((error) => console.error("Error fetching veterinarians:", error));
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-4">Veterinarian List</h2>
      <table className="w-full border-collapse border">
        <thead>
          <tr>
            <th className="border p-2">Name</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Experience</th>
            <th className="border p-2">Fee</th>
          </tr>
        </thead>
        <tbody>
          {veterinarians.map((vet) => (
            <tr key={vet._id}>
              <td className="border p-2">{vet.name}</td>
              <td className="border p-2">{vet.email}</td>
              <td className="border p-2">{vet.experience} years</td>
              <td className="border p-2">${vet.fee}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VeterinarianList;
