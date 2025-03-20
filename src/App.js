import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Box, 
  Container, 
  Flex, 
  Heading, 
  Tab, 
  TabList, 
  TabPanel, 
  TabPanels, 
  Tabs,
  Text,
  useColorModeValue
} from '@chakra-ui/react';
import { fetchMaterials } from './store/materialsSlice';
import { calculateTonnage } from './store/resultsSlice';
import MaterialSelector from './components/inputs/MaterialSelector';
import ThicknessInput from './components/inputs/ThicknessInput';
import TemperatureInput from './components/inputs/TemperatureInput';
import UnitToggle from './components/inputs/UnitToggle';
import OperationsPanel from './components/operations/OperationsPanel';
import ResultsPanel from './components/results/ResultsPanel';
import SavedCalculationsPanel from './components/saved/SavedCalculationsPanel';
import BatchQuantityInput from './components/inputs/BatchQuantityInput';
import ColorModeToggle from './components/common/ColorModeToggle';
import CalculationProgress from './components/common/CalculationProgress';
import Logo from './components/common/Logo';

const App = () => {
  const dispatch = useDispatch();
  const activeTab = useSelector(state => state.ui.activeTab);
  const { selected: selectedMaterial } = useSelector(state => state.materials);
  const parameters = useSelector(state => state.parameters);
  const operations = useSelector(state => state.operations);
  
  // Background colors based on color mode
  const bgColor = useColorModeValue('gray.50', 'gray.800');
  const cardBgColor = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  
  useEffect(() => {
    dispatch(fetchMaterials());
  }, [dispatch]);
  
  useEffect(() => {
    if (selectedMaterial && 
        parameters.thickness > 0 && 
        (operations.perimeter.enabled || 
         operations.holes.enabled || 
         operations.bends.enabled || 
         operations.forms.enabled || 
         operations.draws.enabled)) {
      dispatch(calculateTonnage());
    }
  }, [dispatch, selectedMaterial, parameters, operations]);
  
  const handleTabChange = (index) => {
    const tabNames = ['operations', 'results', 'saved'];
    dispatch({ type: 'ui/setActiveTab', payload: tabNames[index] });
  };
  
  // Calculate the tab index based on activeTab
  const getTabIndex = () => {
    const tabNames = ['operations', 'results', 'saved'];
    return tabNames.indexOf(activeTab);
  };
  
  // Calculate current progress step
  const getCurrentStep = () => {
    if (!selectedMaterial) return 1;
    if (parameters.thickness <= 0) return 2;
    if (!(operations.perimeter.enabled || 
          operations.holes.enabled || 
          operations.bends.enabled || 
          operations.forms.enabled || 
          operations.draws.enabled)) return 3;
    return 4;
  };
  
  return (
    <Box bg={bgColor} minH="100vh">
      <Container maxW="1200px" py={4}>
        <Flex 
          as="header" 
          justify="space-between" 
          align="center" 
          mb={6} 
          pb={3} 
          borderBottomWidth="1px" 
          borderColor={borderColor}
        >
          <Logo height="50px" />
          
          <Flex align="center" gap={4}>
            <UnitToggle />
            <ColorModeToggle />
          </Flex>
        </Flex>
        
        <CalculationProgress currentStep={getCurrentStep()} />
        
        <Box 
          mb={6} 
          p={4} 
          bg={cardBgColor} 
          borderRadius="md" 
          boxShadow="md"
          borderWidth="1px"
          borderColor={borderColor}
        >
          <Flex 
            direction={["column", "row"]} 
            wrap="wrap" 
            gap={4}
          >
            <MaterialSelector />
            <ThicknessInput />
            <TemperatureInput />
            <BatchQuantityInput />
          </Flex>
        </Box>
        
        <Tabs 
          colorScheme="primary" 
          index={getTabIndex()} 
          onChange={handleTabChange}
          variant="enclosed"
        >
          <TabList>
            <Tab>Operations</Tab>
            <Tab>Results</Tab>
            <Tab>Saved Calculations</Tab>
          </TabList>
          
          <TabPanels>
            <TabPanel p={0} pt={4}>
              <Box 
                bg={cardBgColor} 
                borderRadius="md" 
                boxShadow="md"
                p={4}
                borderWidth="1px"
                borderColor={borderColor}
              >
                <OperationsPanel />
              </Box>
            </TabPanel>
            <TabPanel p={0} pt={4}>
              <Box 
                bg={cardBgColor} 
                borderRadius="md" 
                boxShadow="md"
                p={4}
                borderWidth="1px"
                borderColor={borderColor}
              >
                <ResultsPanel />
              </Box>
            </TabPanel>
            <TabPanel p={0} pt={4}>
              <Box 
                bg={cardBgColor} 
                borderRadius="md" 
                boxShadow="md"
                p={4}
                borderWidth="1px"
                borderColor={borderColor}
              >
                <SavedCalculationsPanel />
              </Box>
            </TabPanel>
          </TabPanels>
        </Tabs>
        
        <Flex 
          as="footer" 
          direction="column" 
          align="center" 
          mt={12}
          pt={4}
          borderTopWidth="1px"
          borderColor={borderColor}
        >
          <Text color="gray.500" fontSize="sm">
            &copy; {new Date().getFullYear()} Sutherland Presses Inc. All rights reserved.
          </Text>
          <Text color="gray.500" fontSize="xs" mt={1}>
            Version 1.2.0
          </Text>
        </Flex>
      </Container>
    </Box>
  );
};

export default App; 