// reactstrap components
import {  Container} from "reactstrap";

const Header2 = () => {
  return (
    <>
      <div className="header bg-gradient-info pb-8 pt-5 pt-md-8">
        <Container fluid>
          <div className="header-body">
            {/* Card stats */}
            <h1>
              <span className="text-white">Taller de pintura</span>
            </h1>
          </div>
        </Container>
      </div>
    </>
  );
};

export default Header2;
