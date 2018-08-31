import React from "react";
import { Link } from "react-router-dom";
import { Box, Card, Image, Text } from "gestalt";
const apiUrl = process.env.API_URL || "http://localhost:1337";

const Brand = ({ brand }) => (
  <Box
    display="flex"
    alignItems="center"
    justifyContent="center"
    direction="column"
    width={200}
    // have to set width of each child element/component for flex-wrap to work
    margin={2}
    padding={4}
  >
    <Card
      image={
        <Box height={200} width={200}>
          <Image
            alt="tall"
            color="midnight"
            fit="cover"
            naturalHeight={1}
            naturalWidth={1}
            src={`${apiUrl}${brand.image.url}`}
          />
        </Box>
      }
    >
      <Text bold size="xl" align="center">
        {brand.name}
      </Text>
      <Text align="center">{brand.description}</Text>
      <Text bold size="xl" align="center">
        <Link style={{ color: "dodgerblue" }} to={`/${brand._id}`}>
          See Brews
        </Link>
      </Text>
    </Card>
  </Box>
);

export default Brand;
