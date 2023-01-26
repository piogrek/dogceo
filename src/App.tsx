import React, {FormEventHandler, useEffect} from 'react';
import './App.css';
import {
    Alert,
    Box,
    Button,
    Container,
    FormControl, ImageList, ImageListItem,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
} from "@mui/material";
import axios from "axios";


type ApiResponse = {
    message: any
    status: string
}
type Errors = {
    breed: boolean
    subbreed: boolean
    images: boolean
}

function App() {

    // currently selected breed
    const [breed, setBreed] = React.useState<string>("")
    // currently selevted  sub-breed
    const [subBreed, setCurrentSubBreed] = React.useState<string>("")
    // number of images to show
    const [noImages, setNoImages] = React.useState<number | string>(0)
    const [errors, setErrors] = React.useState<Errors>({breed: false, images: false, subbreed: false})

    const [images, setImages] = React.useState<string[]>([])
    // list of breeds
    const [breeds, setBreeds] = React.useState<string[]>([])
    // list of sub-breeds for current breed
    const [currentSubBreeds, setCurrentSubBreeds] = React.useState<string[]>([])

    //load on start
    useEffect(() => {
        axios.get(
            `https://dog.ceo/api/breeds/list/all`
        ).then(({data}) => {
            setBreeds(Object.keys(data.message))
        })

    }, [])

    // loads subbreeds any time breed changes
    useEffect(() => {
        loadSubBreeds()
        setCurrentSubBreed("")
        // clear any errors
        setErrors({breed: false, images: false, subbreed: false})
    }, [breed])
    useEffect(() => {
        // clear any errors
        setErrors({breed: false, images: false, subbreed: false})
    }, [subBreed])


    function loadSubBreeds() {
        if (!breed) {
            return
        }
        axios.get(`https://dog.ceo/api/breed/${breed}/list`).then(({data}) => {
            setCurrentSubBreeds(data.message[breed])
        })
    }


    const showImages: FormEventHandler = (event) => {
        event.preventDefault()

        // check inputs
        if (!breed) {
            setErrors(prev => ({...prev, breed: true}))
            return
        } else if (currentSubBreeds.length && !subBreed) {
            setErrors(prev => ({...prev, subbreed: true}))
            return
        } else if (!noImages) {
            setErrors(prev => ({...prev, images: true}))
            return
        }
        setErrors({breed: false, images: false, subbreed: false})
        let url = `https://dog.ceo/api/breed/${breed}/images/random/${noImages}`
        if (subBreed) {
            url = `https://dog.ceo/api/breed/${breed}/${subBreed}/images/random/${noImages}`
        }
        axios.get(url).then(({data}) => {
            setImages(data.message)
        })

    };

    return (
        <Container>

            <Box component={"form"} onSubmit={showImages} sx={{display: "flex", pt: 5, gap: 2, alignItems: "center"}}>
                <Box sx={{flex: 1}}>
                    <FormControl fullWidth sx={{"& fieldset": {borderColor: errors.breed ? 'red' : 'inherit'}}}>
                        <InputLabel id="breed-label">Breed</InputLabel>
                        <Select
                            labelId={"breed-label"}
                            value={breed}
                            label="Breed"
                            data-testid="breed"
                            placeholder={"Select Breed"}
                            onChange={(e: SelectChangeEvent) => setBreed(e.target.value)}
                        >
                            {breeds.map(breed => <MenuItem key={breed}
                                                           value={breed}>{breed}</MenuItem>)}
                        </Select>
                    </FormControl>
                </Box>
                {currentSubBreeds.length ? <Box sx={{flex: 1}}>
                    <FormControl fullWidth sx={{"& fieldset": {borderColor: errors.subbreed ? 'red' : 'inherit'}}}>
                        <InputLabel id="subbreed-label">Sub breed</InputLabel>
                        <Select
                            labelId={"subbreed-label"}
                            value={subBreed}
                            data-testid="sub-breed"
                            label="Sub breed"
                            onChange={(e: SelectChangeEvent) => setCurrentSubBreed(e.target.value)}
                        >
                            {currentSubBreeds.map(sbreed => <MenuItem key={sbreed}
                                                                      value={sbreed}>{`${sbreed} ${breed}`}</MenuItem>)}

                        </Select>
                    </FormControl>
                </Box> : null}
                <Box sx={{flex: 1}}>
                    <FormControl fullWidth sx={{"& fieldset": {borderColor: errors.subbreed ? 'red' : 'inherit'}}}>
                        <InputLabel id="images-label">Number of images</InputLabel>
                        <Select sx={{"& fieldset": {borderColor: errors.images ? 'red' : 'inherit'}}} required
                                label={"Number of images"} labelId={"images-label"}
                                data-testid="no-images"
                                value={noImages}
                                onChange={e => setNoImages(e.target.value as string)}>
                            <MenuItem value={0}>Select number of images</MenuItem>
                            {[1, 2, 3, 4, 5, 10, 15, 20].map(num => <MenuItem key={num} value={num}>{num}</MenuItem>)}
                        </Select>
                    </FormControl>
                </Box>
                <Box sx={{flex: 2}}>
                    <Button variant={"contained"} size={"large"} type={"submit"}>View Images</Button>
                </Box>
            </Box>
            <Box mt={2}>{(errors.breed || errors.subbreed || errors.images) ? <Alert severity={"error"}>
                {errors.breed ? "Please select dog breed" : ""}
                {errors.subbreed ? `Please select dog sub-breed for ${breed}` : ""}
                {errors.images ? `Please enter number of images to show` : ""}
            </Alert> : null}</Box>
            <Box>

                <ImageList variant="masonry" cols={3} gap={8}>
                    {images.map((item) => (
                        <ImageListItem key={item}>
                            <img
                                src={`${item}`}
                                srcSet={`${item}`}
                                alt={item}
                                loading="lazy"
                            />
                        </ImageListItem>
                    ))}
                </ImageList>
            </Box>
        </Container>
    );
}

export default App;
