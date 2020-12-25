import { useEffect, useState } from "react";
import "./App.css";
import WatchModal from "./watch";
import { IoMdBulb } from "react-icons/io";
import { FiX } from "react-icons/fi";

const DATA_ENDPOINT = process.env.REACT_APP_ENDPOINT;

function App() {
  const [isLoading, setLoading] = useState(false);
  const [isLoadingError, setLoadingError] = useState(false);
  const [moviesData, setMoviesData] = useState(null);
  const [modalVisibility, setModalVisibility] = useState(false);
  const [movieDetail, setMovieDetail] = useState({});

  useEffect(() => {
    setLoading(true);

    fetch(`${DATA_ENDPOINT}/get-movies`)
      .then((res) => {
        if (res.status === 200) {
          return res.json();
        } else {
          setLoadingError(true);
        }
      })
      .then((response) => {
        setLoading(false);
        setMoviesData(response.data);
      })
      .catch((e) => {});
  }, []);

  return (
    <div className="App">
      <div className="align-center">
        <div className="notice-bar">
          <div className="container">
            <p>
              This web application was built as an illustration of{" "}
              <span className="clickable">
                {" "}
                <a style={{ color: "wheat" }} href="https://nwani.netlfify.com">
                  {" "}
                  this article{" "}
                </a>{" "}
              </span>
              written here, which was my Twilio technical assement to join the
              <span className="clickable">
                {" "}
                <a style={{ color: "wheat" }} href="https://nwani.netlfify.com">
                  {" "}
                  Twilio Voices Program
                </a>{" "}
              </span>
              .
            </p>
          </div>
        </div>
      </div>

      <br />
      <WatchModal
        showModal={modalVisibility}
        details={movieDetail}
        closeModal={() => setModalVisibility(!modalVisibility)}
      />
      <div className="movie-list">
        {isLoading && (
          <div>
            <h1> Loading data </h1>
          </div>
        )}

        {moviesData &&
          moviesData.map(
            ({
              title,
              rating,
              release_date,
              category,
              synopsis,
              img_uri,
              _id,
            }) => (
              <div key={_id} className="card">
                <img className="cover" src={img_uri} alt={title} />

                <div className="container">
                  <h3> {title} </h3>
                  <div className="flex">
                    <p>{category}</p>

                    <p>{rating}</p>
                  </div>
                  <p> {synopsis} </p>

                  <div className="flex">
                    <div className="align-center">
                      <p> Coming on {release_date}.</p>
                    </div>

                    <div className="align-center">
                      <button
                        onClick={() => {
                          setModalVisibility(true);
                          setMovieDetail({
                            title,
                            synopsis,
                            release_date,
                            img_uri,
                            id : _id
                          });
                        }}
                        className="btn"
                      >
                        Subscribe Now
                      </button>
                    </div>
                  </div>
                  <hr style={{ backgroundColor: "white" }} />

                  <div style={{ display: "flex" }}>
                    <div className="icon-hover">
                      <IoMdBulb />
                    </div>
                    <p className="small-text">
                      Subscribers would get notifed via an SMS on movie launch.
                    </p>
                  </div>
                </div>
              </div>
            )
          )}
      </div>
    </div>
  );
}

export default App;
