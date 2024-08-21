import React from "react";
import { Carousel, Button, Card, Avatar } from "antd";

function HomePage() {
    const contentStyle = {
        color: "#fff",
        justifyContent: "center",
        lineHeight: "160px",

        textAlign: "center",
        margin: "auto",
        borderRadius: "10px",
        marginTop: "25px",
    };

    return (
        <div>
            <div className="center">
                <Carousel
                    autoplay
                    style={{ height: "669px", width: "1320px" }}
                >
                    <div>
                        <img
                            className="carousel_carouse"
                            src="https://i.ibb.co/jRNxd4j/80043638.jpg"
                            alt="corosal4"
                            style={{
                                ...contentStyle,
                                height: "669px",
                                width: "1320px",
                            }}
                        />
                    </div>
                    <div>
                        <img
                            className="carousel_carouse"
                            src="https://i.ibb.co/k5Jk9zk/Calfornia-Grill-venue-2.jpg"
                            alt="corosal1"
                            style={{
                                ...contentStyle,
                                height: "669px",
                                width: "1320px",
                            }}
                        />
                    </div>
                    <div>
                        <img
                            className="carousel_carouse"
                            src="https://i.ibb.co/3f5QXkj/213972443.jpg"
                            alt="corosal2"
                            style={{
                                ...contentStyle,
                                height: "669px",
                                width: "1320px",
                            }}
                        />
                    </div>
                    <div>
                        <img
                            className="carousel_carouse"
                            src="https://i.ibb.co/cCTRwJB/About-Galadari-3.jpg"
                            alt="corosal3"
                            style={{
                                ...contentStyle,
                                height: "669px",
                                width: "1320px",
                            }}
                        />
                    </div>
                    <div>
                        <img
                            className="carousel_carouse"
                            src="https://i.ibb.co/PwH54w8/About-Galadari-1.jpg"
                            alt="corosal4"
                            style={{
                                ...contentStyle,
                                height: "669px",
                                width: "1320px",
                            }}
                        />
                    </div>
                </Carousel>
            </div>
            <div className="sg_home_page_txt_area">
                <h3>Your exquisite escape, where comfort meets elegance</h3>
                <h1>Luxury at your doorstep</h1>
            </div>
            <div className="sg_home_page_paragraph_area">
                <div className="sg_home_page_paragraph_area_p1">
                    <h>Renowned as the premier city hotel, Sixth Gear Hotel is strategically located in the vibrant heart of the metropolis, offering stunning views of the serene waterfront and the bustling cityscape. Whether you’re seeking a luxurious retreat, a culinary adventure, or a venue to celebrate life’s special occasions, Sixth Gear Hotel is your haven of comfort and relaxation. Experience unmatched elegance and sophistication at Sixth Gear Hotel, where luxury harmonizes with tranquility in the center of the city.
                    </h>
                </div>
                <div className="sg_home_page_paragraph_area_p2">
                    <h>Whether you're visiting for business or leisure, we are dedicated to extending a warm welcome to all our guests with heartfelt hospitality and a commitment to making your stay unforgettable. Our outstanding services and unwavering pursuit of excellence distinguish Sixth Gear Hotel from the rest. Come, settle in, and feel at home — we’ll take care of every detail for you.</h>
                </div>
            </div>
        </div>
    );
}

export default HomePage;
