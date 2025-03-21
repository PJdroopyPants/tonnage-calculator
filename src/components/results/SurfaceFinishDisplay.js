import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Box,
  Grid,
  Flex,
  Text,
  FormControl,
  FormLabel,
  Select,
  Input,
  InputGroup,
  InputRightAddon,
  useColorModeValue
} from '@chakra-ui/react';
import { calculateSurfaceFinish } from '../../services/SurfaceFinishService';
import CardContainer from '../common/CardContainer';

const SurfaceFinishDisplay = () => {
  const [inputValues, setInputValues] = useState({
    lubricantType: 'medium',
    toolSurfaceRoughness: 0.8,
    toolMaterial: 'standard',
    surfaceSpeed: 100
  });
  
  const { selected: material } = useSelector(state => state.materials);
  const { isMetric } = useSelector(state => state.parameters);
  
  // Color mode styles
  const labelColor = useColorModeValue('gray.600', 'gray.400');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const resultBg = useColorModeValue('blue.50', 'blue.900');
  const cardBg = useColorModeValue('gray.50', 'gray.700');
  
  if (!material) {
    return null;
  }
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputValues(prev => ({
      ...prev,
      [name]: name === 'lubricantType' || name === 'toolMaterial' ? value : parseFloat(value)
    }));
  };
  
  // Calculate surface finish values
  const { 
    surfaceRoughness, 
    microhardness, 
    surfaceTexture,
    textureRating,
    qualityClass,
    recommendations
  } = calculateSurfaceFinish(material, inputValues, isMetric);
  
  // Define gauge properties based on roughness value
  const getGaugeProps = (ra) => {
    if (ra < 0.4) return { color: 'green', label: 'Excellent' };
    if (ra < 1.6) return { color: 'blue', label: 'Good' };
    if (ra < 3.2) return { color: 'yellow', label: 'Acceptable' };
    if (ra < 6.3) return { color: 'orange', label: 'Rough' };
    return { color: 'red', label: 'Poor' };
  };
  
  const gaugeProps = getGaugeProps(surfaceRoughness);
  
  // Get lubricant info
  const getLubricantInfo = (type) => {
    switch(type) {
      case 'light': return 'Light oil, reduced friction';
      case 'medium': return 'Medium viscosity, standard protection';
      case 'heavy': return 'Heavy-duty, high pressure resistance';
      case 'dry': return 'No lubricant, may increase friction';
      default: return 'Standard lubricant';
    }
  };
  
  const lubricantInfo = getLubricantInfo(inputValues.lubricantType);
  
  return (
    <CardContainer title="Surface Finish Prediction">
      <Text fontSize="sm" color={labelColor} mb={4}>
        Predict the surface finish quality based on the material and process parameters.
      </Text>
      
      <Grid templateColumns={["1fr", null, "1fr 1fr"]} gap={4} mb={5}>
        <FormControl size="sm">
          <FormLabel htmlFor="lubricantType" fontSize="xs" color={labelColor} mb={1}>
            Lubricant Type
          </FormLabel>
          <Select
            id="lubricantType"
            name="lubricantType"
            value={inputValues.lubricantType}
            onChange={handleInputChange}
            size="sm"
          >
            <option value="light">Light</option>
            <option value="medium">Medium</option>
            <option value="heavy">Heavy Duty</option>
            <option value="dry">Dry Processing</option>
          </Select>
        </FormControl>
        
        <FormControl size="sm">
          <FormLabel htmlFor="toolSurfaceRoughness" fontSize="xs" color={labelColor} mb={1}>
            Tool Surface Roughness
          </FormLabel>
          <InputGroup size="sm">
            <Input
              id="toolSurfaceRoughness"
              name="toolSurfaceRoughness"
              type="number"
              step="0.1"
              min="0.1"
              value={inputValues.toolSurfaceRoughness}
              onChange={handleInputChange}
            />
            <InputRightAddon children="Ra μm" />
          </InputGroup>
        </FormControl>
        
        <FormControl size="sm">
          <FormLabel htmlFor="toolMaterial" fontSize="xs" color={labelColor} mb={1}>
            Tool Material
          </FormLabel>
          <Select
            id="toolMaterial"
            name="toolMaterial"
            value={inputValues.toolMaterial}
            onChange={handleInputChange}
            size="sm"
          >
            <option value="standard">Standard Tool Steel</option>
            <option value="carbide">Carbide</option>
            <option value="ceramic">Ceramic</option>
            <option value="diamond">Diamond Coated</option>
          </Select>
        </FormControl>
        
        <FormControl size="sm">
          <FormLabel htmlFor="surfaceSpeed" fontSize="xs" color={labelColor} mb={1}>
            Surface Speed
          </FormLabel>
          <InputGroup size="sm">
            <Input
              id="surfaceSpeed"
              name="surfaceSpeed"
              type="number"
              step="5"
              min="10"
              value={inputValues.surfaceSpeed}
              onChange={handleInputChange}
            />
            <InputRightAddon children={isMetric ? "m/min" : "ft/min"} />
          </InputGroup>
        </FormControl>
      </Grid>
      
      {/* Results Display */}
      <Box 
        p={4} 
        bg={resultBg} 
        borderRadius="md" 
        mb={4}
        borderLeftWidth="3px"
        borderLeftColor={`${gaugeProps.color}.500`}
      >
        <Flex justify="space-between" align="center" mb={3}>
          <Text fontSize="sm" fontWeight="medium">
            Predicted Surface Finish:
          </Text>
          <Flex align="center">
            <Text fontSize="md" fontWeight="bold" color={`${gaugeProps.color}.500`} mr={2}>
              {surfaceRoughness.toFixed(2)} Ra
            </Text>
            <Text fontSize="xs" px={2} py={1} borderRadius="full" bg={`${gaugeProps.color}.100`} color={`${gaugeProps.color}.800`}>
              {gaugeProps.label}
            </Text>
          </Flex>
        </Flex>
        
        <Text fontSize="xs" color={labelColor} mb={2}>
          ISO Surface Quality Class: {qualityClass}
        </Text>
        
        <Text fontSize="xs" color={labelColor}>
          Finish is suitable for {textureRating} applications
        </Text>
      </Box>
      
      <Grid templateColumns={["1fr", null, "repeat(2, 1fr)"]} gap={3} mb={4}>
        <Box p={3} bg={cardBg} borderRadius="md">
          <Text fontSize="xs" color={labelColor} mb={1}>
            Microhardness Impact
          </Text>
          <Text fontSize="sm" fontWeight="medium">
            {microhardness.change > 0 
              ? `+${microhardness.change}% (Hardening)`
              : `${microhardness.change}% (Softening)`}
          </Text>
          <Text fontSize="xs" color={labelColor} mt={1}>
            {microhardness.description}
          </Text>
        </Box>
        
        <Box p={3} bg={cardBg} borderRadius="md">
          <Text fontSize="xs" color={labelColor} mb={1}>
            Surface Texture
          </Text>
          <Text fontSize="sm" fontWeight="medium">
            {surfaceTexture}
          </Text>
          <Text fontSize="xs" color={labelColor} mt={1}>
            {lubricantInfo}
          </Text>
        </Box>
      </Grid>
      
      <Box p={3} bg={cardBg} borderRadius="md">
        <Text fontSize="sm" fontWeight="medium" color={labelColor} mb={2}>
          Improvement Recommendations
        </Text>
        
        {recommendations.map((rec, index) => (
          <Text key={index} fontSize="xs" mb={1}>
            • {rec}
          </Text>
        ))}
      </Box>
    </CardContainer>
  );
};

export default SurfaceFinishDisplay; 