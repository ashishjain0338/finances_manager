import { CheckCircleFill, XCircleFill } from 'react-bootstrap-icons';

function SPOFDefination(props){
    const renderStatus = (label, value) => (
        <span className="me-3">
          <strong>{label}:</strong>{' '}
          {value ? (
            <Badge bg="success"><CheckCircleFill className="me-1" />Yes</Badge>
          ) : (
            <Badge bg="danger"><XCircleFill className="me-1" />No</Badge>
          )}
        </span>
      );

    return (
        <div>
            <p>Hello World</p>
        </div>
    )
}

export {SPOFDefination}