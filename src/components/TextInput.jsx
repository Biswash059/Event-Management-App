const TextInput = ({ name, value, onChange, placeholder, type }) => (
  <input
    name={name}
    value={value}
    onChange={onChange}
    type={type}
    placeholder={placeholder}
    className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
  />
);

export default TextInput;
