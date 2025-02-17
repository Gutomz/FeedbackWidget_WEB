import { ArrowLeft } from 'phosphor-react-native';
import React, { useState } from 'react';
import { Image, Text, TextInput, TouchableOpacity, View } from 'react-native';
import RNFS from 'react-native-fs';
import { captureScreen } from 'react-native-view-shot';
import { api } from '../../libs/api';
import { theme } from '../../theme';
import { feedbackTypes } from '../../utils/feedbackTypes';
import { Button } from '../Button';
import { ScreenshotButton } from '../ScreenshotButton';
import { FeedbackType } from '../Widget';
import { styles } from './styles';

interface Props {
  feedbackType: FeedbackType;
  onBackPress: () => void;
  onFeedbackSent: () => void;
}

export function Form({ feedbackType, onBackPress, onFeedbackSent }: Props) {
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [comment, setComment] = useState("");

  const feedbackTypeInfo = feedbackTypes[feedbackType];

  function handleScreenshot() {
    captureScreen({
      format: 'jpg',
      quality: 0.8
    }).then(uri => setScreenshot(uri))
    .catch(error => console.log(error));
  }

  function handleScreenshotRemove() {
    setScreenshot(null);
  }

  async function handleSendFeedback() {
    if (isLoading) return;
    setIsLoading(true);

    try {
      let screenshotBase64 = undefined;
      if (screenshot) {
        screenshotBase64 = await RNFS.readFile(screenshot, 'base64');
        screenshotBase64 = `data:image/png;base64,${screenshotBase64}`;
      }
      
      await api.post("/feedbacks", { 
        type: feedbackType,
        comment,
        screenshot: screenshotBase64,
      });
      setIsLoading(false);
      onFeedbackSent();
    } catch (e) {
      console.log(e);
      setIsLoading(false);
    }
  } 

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBackPress}>
          <ArrowLeft 
            size={24}
            weight="bold"
            color={theme.colors.text_secondary}
          />
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Image style={styles.titleImage} source={feedbackTypeInfo.image} />
          <Text style={styles.titleText}>
            {feedbackTypeInfo.title}
          </Text>
        </View>
      </View>
      <TextInput 
        multiline
        style={styles.input}
        placeholder="Algo não está funcionando bem? Queremos corrigir. Conte com detalhes o que está acontecendo..."
        placeholderTextColor={theme.colors.text_secondary}
        onChangeText={(value) => setComment(value)}
      />
      <View style={styles.footer}>
        <ScreenshotButton 
          onTakeShot={handleScreenshot}
          onRemoveShot={handleScreenshotRemove}
          screenshot={screenshot}
        />
        <Button isLoading={isLoading} onPress={handleSendFeedback}>
          Enviar Feedback
        </Button>
      </View>
    </View>
  );
}
