export default `
<html lang="en">
<head>
  <style>
    table, tr, td {
      border: 1px solid black;
      border-collapse: collapse;
      width: 100%;
    }
    tr, td {
      padding: 1em;
    }
  </style>
</head>
<body>
  <div style="font-family: Verdana;">
    <h1 style="background: black; color: white; padding: 2em; font-size: 24px;">Congratulations, your order has been confirmed</h1>
    <div>
      <h5>
        Hi %FIRSTNAME%
        <br /> We have received your order
      </h5>
      <div>
        <h5>Order %REFERENCE% ( %DATE% )</h5>
        <div>
          <table>
            <tr>
              <td style="font-size: 14px; font-weight: bold;">Product</td>
              <td style="font-size: 14px; font-weight: bold;">Quantity</td>
              <td style="font-size: 14px; font-weight: bold;">Price</td>
            </tr>
            %ORDERS%
            <tr>
              <td colspan="2" style="font-size: 14px; font-weight: 600;">Subtotal</td>
              <td>%SUBTOTAL%</td>
            </tr>
            <tr>
              <td colspan="2" style="font-size: 14px; font-weight: 600;">Shipping</td>
              <td>%SHIPPING_FEE%</td>
            </tr>
            <tr>
              <td colspan="2" style="font-size: 14px; font-weight: 600;">Total</td>
              <td>%TOTAL%</td>
            </tr>
          </table>
        </div>
      </div>
      <div>
        <h5>Shipping Information</h2>
        <div>
          <div>Name: %FIRSTNAME% %LASTNAME%</div>
          <div>Phone Number: %PHONE%</div>
          <div>Email: %EMAIL%</div>
          <div>Address: %ADDRESS%</div>
          <div>City: %CITY%</div>
          <div>State: %STATE%</div>
        </div>
      </div>
      <div>
        <h5>Additional Information</h5>
        <div style="border: 1px solid black;">%ADDITIONAL_INFO%</div>
      </div>
      <h5>Good luck on taking over the world</h5>
    </div>
  </div>
</body>
</html>
`;
