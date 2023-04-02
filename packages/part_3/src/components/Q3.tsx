import React, { useState } from "react";

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
}

const ContactForm: React.FC = () => {
  const [showData, setShowData] = useState(false);
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    phone: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const validate = () => {
    const newErrors = {
      name: "",
      email: "",
      phone: "",
    };

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone is required";
    }

    setErrors(newErrors);

    return !Object.values(newErrors).some((error) => error !== "");
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (validate()) {
      setShowData(true);
    } else {
      setShowData(false);
    }
  };

  return (
    <div className="max-w-sm flex mt-10 justify-center  m-auto flex-col">
      <form onSubmit={handleSubmit} className="w-full">
        <div className="mb-4">
          <div className="flex justify-between   w-full">
            <label>Name:</label>
            <input
              className="input input-bordered ml-4"
              type="text"
              name="name"
              id="name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div className="text-error">
            {errors.name && <p>{errors.name}</p>}
          </div>
        </div>
        <div className="mb-4">
          <div className="flex justify-between   w-full">
            <label>Email:</label>
            <input
              className="input input-bordered ml-4"
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
            />{" "}
          </div>
          {errors.email && <p>{errors.email}</p>}
        </div>
        <div className="mb-4">
          <div className="flex justify-between   w-full">
            <label>Phone:</label>
            <input
              className="input input-bordered ml-4"
              type="tel"
              name="phone"
              id="phone"
              value={formData.phone}
              onChange={handleChange}
            />{" "}
          </div>
          {errors.phone && <p>{errors.phone}</p>}
        </div>
        <button type="submit" className="btn">
          Submit
        </button>
      </form>
      {showData && (
        <>
          <div className="bg-black flex p-5 rounded-lg mt-5 flex-col">
            <h1>{formData.email}</h1>
            <h1>{formData.name}</h1>
            <h1>{formData.phone}</h1>
          </div>
          <button
            type="submit"
            className="btn mt-4 w-fit"
            onClick={() => setShowData(false)}
          >
            Clear
          </button>
        </>
      )}
    </div>
  );
};

export default ContactForm;
