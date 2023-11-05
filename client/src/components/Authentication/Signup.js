import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { createUser } from "../../services/UserService";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const history = useNavigate();

  // For adding picture we are going to use Cloudinary.
  const [pic, setPic] = useState("");

  const [show1, setShow1] = useState(false);
  const [show2, setShow2] = useState(false);

  const handleClick1 = () => {
    setShow1(!show1);
  };

  const handleClick2 = () => {
    setShow2(!show2);
  };

  const postDetails = (pics) => {
    console.log(pics.type);

    setLoading(true);

    if (pics === undefined) {
      toast({
        title: "Please Select an Image !",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    // If the image is jpeg or png , we will move forward.
    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      console.log("");
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "chatsocial-app");
      data.append("clound_name", "dw92xoahv");

      fetch("https://api.cloudinary.com/v1_1/dw92xoahv/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          // console.log(data);
          setPic(data.url.toString());
          console.log(data.url.toString());
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    } else {
      toast({
        title: "Please Select an Image !",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }
  };

  const submitHandler = async () => {
    // console.log(email, name);
    setLoading(true);

    if (!name || !email || !password || !confirmPassword) {
      toast({
        title: "Please Fill all the Fields.",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Password Do Not Match",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    try {
      const { data } = await createUser({ name, email, password, pic });

      toast({
        title: "Sign Up Successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });

      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      history("/chats");
    } catch (error) {
      toast({
        title: "Error Occured !",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };

  return (
    <VStack spacing='5px' color='black'>
      <FormControl id='first-name' isRequired>
        <FormLabel>Name</FormLabel>
        <Input
          required
          placeholder='Enter Your Name'
          onChange={(e) => setName(e.target.value)}></Input>
      </FormControl>
      <FormControl id='email' isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          required
          placeholder='Enter Your Email'
          onChange={(e) => setEmail(e.target.value)}></Input>
      </FormControl>

      <FormControl id='password' isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            type={show1 ? "text" : "password"}
            placeholder='Enter Your Password'
            onChange={(e) => setPassword(e.target.value)}
          />
          <InputRightElement width='4.5rem'>
            <Button h='1.75rem' size='sm' onClick={() => handleClick1()}>
              {show1 ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <FormControl id='confirmPassword' isRequired>
        <FormLabel>Confirm Password</FormLabel>
        <InputGroup>
          <Input
            type={show2 ? "text" : "password"}
            placeholder='Enter Your Confirm Password'
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <InputRightElement width='4.5rem'>
            <Button h='1.75rem' size='sm' onClick={() => handleClick2()}>
              {show2 ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <FormControl id='pic' isRequired>
        <FormLabel>Upload Your Picture</FormLabel>
        <Input
          type='file'
          p={1.5}
          accept='image/'
          onChange={(e) => postDetails(e.target.files[0])}
        />
      </FormControl>
      <Button
        mt={4}
        colorScheme='blue'
        style={{ marginTop: 15 }}
        w='100%'
        onClick={() => submitHandler()}
        isLoading={loading}>
        Submit
      </Button>
    </VStack>
  );
};

export default Signup;
