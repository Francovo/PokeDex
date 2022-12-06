import { ChakraProvider } from '@chakra-ui/react';
import Home from '../components/Home/Home';
import 'react-notifications/lib/notifications.css';

function App() {
	return (
		<ChakraProvider resetCSS>
			<Home />
		</ChakraProvider>
	);
}

export default App;
