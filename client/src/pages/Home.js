import React, { useEffect } from "react";
import {
  Box,
  Button,
  Container,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import Login from "../components/Authentication/Login";
import Signup from "../components/Authentication/Signup";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const history = useNavigate();
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));

    if (user) {
      history("/chats");
    }
  }, []);

  return (
    // This container makes our website resposive , adjusting itself to different screen sizes.
    <Container maxW='md' centerContent>
      <Box
        d='flex'
        justifyContent='center'
        bgColor='white'
        p={3}
        w='100%'
        m='40px 0 15px 0'
        borderRadius='lg'
        borderWidth='1px'>
        <Text
          textAlign='center'
          color='black'
          fontFamily='Work Sans'
          fontWeight='bold'>
          ChatGram
        </Text>
      </Box>
      <Box
        bg='white'
        w='100%'
        p={4}
        borderRadius='lg'
        color='black'
        borderWidth='1px'>
        <Tabs variant='soft-rounded'>
          <TabList mb='1em'>
            <Tab width='50%'>Login</Tab>
            <Tab width='50%'>Sign Up</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <Signup />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
};

export default Home;
