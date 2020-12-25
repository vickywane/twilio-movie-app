import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import { FiX } from "react-icons/fi";

const handleVerification = ({ number, code }) => {
  const ENDPOINT = process.env.REACT_APP_ENDPOINT;
  const requestBody = JSON.stringify({
    countryCode: code,
    mobileNumber: number,
  });

  fetch(`${ENDPOINT}/verify-number`, {
    method: "POST",
    headers: { "Content-type": "application/json " },
    body: requestBody,
  })
    .then((res) => {
      if (res.status === 200) {
        return res.json();
      }
    })
    .then((response) => console.log(response))
    .catch((e) => console.log(e));
};

const Watch = ({ showModal, closeModal, details }) => {
  const [mobileNumber, setMobileNumber] = useState("");
  const [verifiedNumber, setNumberVerification] = useState(false);
  const [code, setCode] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isSubscribed, setSubscription] = useState(false);

  const verifyCode = () => {
    setSubscription(true);

    const ENDPOINT = process.env.REACT_APP_ENDPOINT;
    const requestBody = JSON.stringify({
      verificationCode: verificationCode,
      mobileNumber,
      countryCode: code,
      movieId: details.id,
    });

    fetch(`${ENDPOINT}/add-verified-subscriber`, {
      method: "POST",
      body: requestBody,
      headers: { "Content-type": "application/json " },
    })
      .then((data) => data.json())
      .then((response) => {
        if (response.status === "confirmed") {
          setSubscription(true);
        }
      })
      .catch((e) => console.log(e));
  };

  return (
    <Modal
      size="lg"
      show={showModal}
      style={{ marginTop: "5%" }}
      onHide={() => {
        setNumberVerification(false);
        setVerificationCode("");
        setCode("");
        setMobileNumber("");
        setSubscription(false);
        closeModal();
      }}
    >
      <div style={{ background: "#282c34", color: "#fff" }}>
        <div className="modal-header">
          <div className="align-center">
            <h5> Confirm Subscription </h5>
          </div>

          <div className="align-center">
            <div
              onClick={() => {
                setNumberVerification(false);
                setVerificationCode("");
                setCode("");
                setMobileNumber("");
                setSubscription(false);
                closeModal();
              }}
              className="icon-hover"
            >
              <FiX />
            </div>
          </div>
        </div>
        
        {!verifiedNumber ? (
          <div className="container">
            <div className="flex">
              <div className="center">
                <h4> {details.title} </h4>
              </div>

              <h5 style={{ textAlign: "left" }}>
                Coming on: {details.release_date}
              </h5>
            </div>

            <br />
            <p>{details.synopsis}</p>
            <br />
            <form style={{ textAlign: "center" }}>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <input
                  className="input-field"
                  placeholder={"Country Code + "}
                  style={{ margin: "0 1rem", width: "35%" }}
                  onChange={(e) => setCode(e.target.value)}
                  type="number"
                />
                <input
                  className="input-field"
                  placeholder={
                    mobileNumber.length < 1
                      ? "Your mobile number"
                      : mobileNumber
                  }
                  onChange={(e) => setMobileNumber(e.target.value)}
                  type="number"
                />
              </div>

              <br />
              <br />

              <div className="flex">
                <p>
                A code would be sent to the number added above for verification.
                </p>

                <div>
                  <button
                    disabled={mobileNumber.length < 1}
                    className="btn"
                    onClick={() => {
                      setNumberVerification(true);
                      handleVerification({
                        code,
                        id: details.id,
                        number: mobileNumber,
                      });
                    }}
                  >
                    Verify My Number
                  </button>
                </div>
              </div>
            </form>
          </div>
        ) : (
          <div className="container">
            {!isSubscribed ? (
              <div>
                <h5 className="align-center">
                  Enter 6 digit code sent to {code}
                  {mobileNumber}
                </h5>
                <p style={{ textAlign: "center" }}>
                  Haven't recieved it? <br />
                  <span className="clickable"> Resend code </span> or{" "}
                  <span
                    className="clickable"
                    onClick={() => setNumberVerification(false)}
                  >
                    Change Number
                  </span>
                </p>
                <br />
                <form style={{ textAlign: "center" }}>
                  <input
                    style={{ width: "50%" }}
                    className="input-field"
                    placeholder="6 digit code"
                    onChange={(e) => setVerificationCode(e.target.value)}
                    type="number"
                  />
                  <br />
                  <br />

                  <div className="align-center">
                    <button
                      className="btn"
                      style={{ width: "50%" }}
                      onClick={() => {
                        verifyCode();
                      }}
                    >
                      Confirm My Code
                    </button>
                  </div>
                </form>
                <br />
              </div>
            ) : (
              <SubscriptionSuccessful details={details} />
            )}
          </div>
        )}
      </div>
    </Modal>
  );
};

const SubscriptionSuccessful = ({ details }) => (
  <div className="container">
    <br />
    <br />
    <h5 style={{ textAlign: "center" }}>
      You have been subscribed for {details.title}. <br /> You would be notified
      on {details.release_date} when the movie is launched via an SMS.{" "}
    </h5>

    <br />
    <br />
  </div>
);

export default Watch;
