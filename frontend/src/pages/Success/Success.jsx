import "./Success.css";
import succss_img from '../../assets/success.png'


export default function Success() {
  return (
    <section className="success-page">
      <div className="success-card">
        <img src={succss_img} alt="" />
        <h2>Order Placed Successfully!</h2>
        <p>We will contact you soon.</p>
      </div>
    </section>
  );
}
