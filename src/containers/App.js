import { ChakraProvider } from '@chakra-ui/react';
import Home from '../components/Home/Home';

function App() {
	return (
		<ChakraProvider resetCSS>
			<Home />
		</ChakraProvider>
	);
}

export default App;
