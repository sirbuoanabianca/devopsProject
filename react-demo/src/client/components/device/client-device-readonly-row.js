import React from "react";

const ClientDevicesRow = ({ device }) => {
  return (
    <tr>
      <td>{device.description}</td>
      <td>{device.address}</td>
      <td>{device.usernameOwner}</td>
      <td>{device.max_consumption}</td>

    </tr>
  );
};

export default ClientDevicesRow;
